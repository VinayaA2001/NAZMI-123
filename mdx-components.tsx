// mdx-components.tsx  (keep .tsx extension)
export function useMDXComponents(components: any) {
  return {
    h1: ({ children, ...props }: any) => (
      <h1 className="title-2 mt-6 mb-3" {...props}>{children}</h1>
    ),
    p: ({ children, ...props }: any) => (
      <p className="my-3 leading-7 muted" {...props}>{children}</p>
    ),
    ...components,
  };
}
