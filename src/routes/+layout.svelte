<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';

  import { page } from '$app/stores';
  import { createPortal } from '$lib/actions/portal';
  import { setIsInternalRouting } from '$lib/client/storage/internal-routing';
  import { initUserProfileStore } from '$lib/store/user-profile';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  initUserProfileStore(data.userProfile);

  let description: string,
    image = data.seo.image,
    keyword = data.seo.keyword,
    shouldBlockSearchIndex: boolean | undefined,
    title: string;

  $: {
    ({ description, title, shouldBlockSearchIndex } = $page.data.seo);

    if (!title) {
      title = data.seo.title;
    } else if (title !== data.seo.title && !title.endsWith(`| ${data.seo.title}`)) {
      title = `${title} | ${data.seo.title}`;
    }

    if (!description) {
      description = data.seo.description;
    }

    if ($page.data.seo.image) {
      image = $page.data.seo.image;
    }

    if ($page.data.seo.keyword) {
      keyword = $page.data.seo.keyword;
    }
  }

  onMount(() => {
    setIsInternalRouting(true);
    return () => {
      setIsInternalRouting(false);
    };
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />

  <link rel="canonical" href={$page.url.href} />
  <meta property="og:url" content={$page.url.href} />
  <meta name="twitter:url" content={$page.url.href} />

  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
  <meta name="twitter:description" content={description} />

  <meta property="og:image" content={image} />
  <meta name="twitter:image" content={image} />

  <meta name="keywords" content={keyword} />

  {#if shouldBlockSearchIndex}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<slot />

<div use:createPortal />
