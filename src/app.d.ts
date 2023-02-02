// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface SEOMeta {
      description: string;
      image?: string;
      keyword?: string;
      shouldBlockSearchIndex?: boolean;
      title: string;
    }

    // interface Error {}

    // interface Locals {}

    interface PageData {
      seo: SEOMeta;
    }

    // interface Platform {}
  }
}

export {};
