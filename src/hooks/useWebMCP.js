import { useEffect } from "react";
import { useApp } from "../context/AppContext";
export default function useWebMCP() {
  const { services } = useApp();
  useEffect(() => {
    if (!document.modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        document.modelContext.registerTool(
          {
            name: "search_home_services",
            description:
              "Read available services and prices for a search term.",
            inputSchema: {
              type: "object",
              properties: { query: { type: "string" } },
              required: ["query"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute(input) {
              if (typeof input?.query !== "string")
                throw new Error("query must be a string");
              return {
                services: services
                  .filter((s) =>
                    s.name.toLowerCase().includes(input.query.toLowerCase()),
                  )
                  .map(({ slug, name, price }) => ({ slug, name, price })),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [services]);
}
