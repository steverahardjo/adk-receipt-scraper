// emails/test.tsx
import { Html, Button } from "@react-email/components";
import * as React from "react";

export default function TestEmail() {
  return (
    <Html>
      <Button href="https://example.com">Click me</Button>
    </Html>
  );
}
