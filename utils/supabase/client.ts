// Simple placeholder for supabase client
// Since we don't have @supabase/ssr installed, let's create a simple stub
export function createClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          data: [],
          error: null,
        }),
      }),
      insert: () => ({
        data: null,
        error: null,
      }),
      delete: () => ({
        eq: () => ({
          data: null,
          error: null,
        }),
      }),
    }),
  };
}
