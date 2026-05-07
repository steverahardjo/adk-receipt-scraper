<script lang="ts">
  import { onMount } from 'svelte'
  import { Page, Navbar, NavRight, PageContent, Link, Icon, Button, Toolbar } from 'framework7-svelte'
  import Drawer from '$lib/features/core/Drawer.svelte'
  import { theme } from '$lib/features/core/theme.svelte'

  let {
    title = '',
    large = false,
    noNavbar = false,
    noToolbar = false,
    fab = false,
    children,
  }: {
    title?: string
    large?: boolean
    noNavbar?: boolean
    noToolbar?: boolean
    fab?: boolean
    children?: import('svelte').Snippet
  } = $props()

  let drawerOpen = $state(false)
  let hideNavbar = $derived(noNavbar || fab)

  function openDrawer() {
    drawerOpen = true
  }

  onMount(() => {
    theme.init()
  })
</script>

<Page>
  <Drawer opened={drawerOpen} onClose={() => drawerOpen = false} />

  {#if !hideNavbar}
    <Navbar {title} {large}>
      <NavRight>
        <Link onclick={openDrawer}>
          <Icon ios="f7:menu" />
        </Link>
      </NavRight>
    </Navbar>
  {/if}

  <PageContent>
    {@render children?.()}
  </PageContent>

  {#if !noToolbar}
    <Toolbar tabbar labels bottom>
      <Link href="/" tab-link>
        <Icon ios="f7:house" />
        <span>Home</span>
      </Link>
      <Link href="/chatbot" tab-link>
        <Icon ios="f7:chat_bubble_2" />
        <span>Chat</span>
      </Link>
      <Link href="/expense_form" tab-link>
        <Icon ios="f7:plus_circle_fill" />
        <span>Add</span>
      </Link>
      <Link href="/records" tab-link>
        <Icon ios="f7:list_bullet" />
        <span>Records</span>
      </Link>
    </Toolbar>
  {/if}

  {#if fab}
    <Button fill class="fab-btn" onclick={openDrawer}>
      <Icon ios="f7:menu" />
    </Button>
  {/if}
</Page>

<style>
  :global(.fab-btn) {
    position: fixed;
    right: 0;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 52px);
    z-index: 10000;
    width: 52px;
    height: 52px;
    border-radius: 16px 0 0 0 !important;
    --f7-button-border-radius: 16px 0 0 0;
  }

  :global(.fab-btn.button-fill) {
    min-width: 52px;
  }

  :global(.navbar .title) {
    font-family: 'Manrope', system-ui, sans-serif;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: -0.01em;
  }
</style>
