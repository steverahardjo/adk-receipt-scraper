use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct QrisData {
    pub code_type: String,
    pub merchant: String,
    pub amount: Option<u64>,
    pub reference: Option<String>,
    pub raw: String,
    pub deeplink: String,
}

fn parse_tlv(data: &str) -> Vec<(u8, String)> {
    let mut result = Vec::new();
    let mut i = 0;
    let bytes = data.as_bytes();
    while i + 2 <= bytes.len() {
        let tag = bytes[i];
        let len = if i + 3 <= bytes.len() {
            bytes[i + 1] as usize
        } else {
            break;
        };
        let value_start = i + 2;
        let value_end = (value_start + len).min(bytes.len());
        let value = String::from_utf8_lossy(&bytes[value_start..value_end]).to_string();
        result.push((tag, value));
        i = value_end;
    }
    result
}

fn find_tag(tags: &[(u8, String)], target: u8) -> Option<&str> {
    tags.iter().find(|(t, _)| *t == target).map(|(_, v)| v.as_str())
}

fn urlencoding(s: &str) -> String {
    let mut result = String::new();
    for byte in s.bytes() {
        match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                result.push(byte as char);
            }
            b' ' => result.push_str("%20"),
            _ => {
                result.push_str(&format!("%{:02X}", byte));
            }
        }
    }
    result
}

fn parse_query_string(qs: &str) -> Vec<(String, String)> {
    qs.split('&')
        .filter_map(|pair| {
            let mut parts = pair.splitn(2, '=');
            let key = parts.next()?.to_string();
            let val = parts.next().unwrap_or("").to_string();
            Some((key, val))
        })
        .collect()
}

fn url_decode(s: &str) -> String {
    let mut result = String::new();
    let mut chars = s.chars();
    while let Some(c) = chars.next() {
        if c == '%' {
            let hex: String = chars.by_ref().take(2).collect();
            if let Ok(byte) = u8::from_str_radix(&hex, 16) {
                result.push(byte as char);
            }
        } else {
            result.push(c);
        }
    }
    result
}

fn parse_tng_deeplink(payload: &str) -> Result<QrisData, String> {
    // Format: tngdwallet://client/dl/mp?mpid=1234567&path=...&orderid=...
    let query_start = payload.find('?').ok_or("Invalid TNG deeplink: no query")?;
    let qs = &payload[query_start + 1..];
    let params = parse_query_string(qs);

    let mpid = params
        .iter()
        .find(|(k, _)| k == "mpid")
        .map(|(_, v)| v.as_str())
        .unwrap_or("unknown");

    let orderid = params
        .iter()
        .find(|(k, _)| k == "orderid")
        .map(|(_, v)| v.clone());

    let path = params
        .iter()
        .find(|(k, _)| k == "path")
        .map(|(_, v)| url_decode(v));

    let merchant = format!("TNG Merchant {}", mpid);
    let merchant_param = urlencoding(&merchant);
    let amount_param = orderid.as_ref().map(|_| String::new()).unwrap_or_default();
    let deeplink = format!("/expense_form?merchant={}{}", merchant_param, amount_param);

    let reference = orderid.or_else(|| path);

    Ok(QrisData {
        code_type: "tng".to_string(),
        merchant,
        amount: None,
        reference,
        raw: payload.to_string(),
        deeplink,
    })
}

fn parse_standard_qris(payload: &str) -> Result<QrisData, String> {
    let tags = parse_tlv(payload);

    let merchant = find_tag(&tags, 59)
        .or_else(|| find_tag(&tags, 58))
        .unwrap_or("Unknown")
        .to_string();

    let amount = find_tag(&tags, 54).and_then(|a| a.parse::<u64>().ok());

    let reference = find_tag(&tags, 62).and_then(|ad| {
        let inner = parse_tlv(ad);
        find_tag(&inner, 1).map(|r| r.to_string())
    });

    let amount_param = amount
        .map(|a| format!("&amount={}", a))
        .unwrap_or_default();
    let merchant_param = urlencoding(&merchant);
    let deeplink = format!(
        "/expense_form?merchant={}{}",
        merchant_param, amount_param
    );

    Ok(QrisData {
        code_type: "qris".to_string(),
        merchant,
        amount,
        reference,
        raw: payload.to_string(),
        deeplink,
    })
}

pub fn parse_qris(payload: &str) -> Result<QrisData, String> {
    if payload.starts_with("tngdwallet://") {
        parse_tng_deeplink(payload)
    } else {
        parse_standard_qris(payload)
    }
}
