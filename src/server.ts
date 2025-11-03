#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dns from "dns/promises";

// Create and start the MCP server
const server = new McpServer({
  name: "dns",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "dns-query",
  "Make a DNS query for a given name and type",
  {
    name: z.string().describe("The domain name to query"),
    type: z
      .string()
      .describe("The DNS record type (A, AAAA, MX, TXT, CNAME, NS, etc.)"),
  },
  async ({ name, type }) => {
    if (!name || !type) {
      // TODO: Validate inputs
    }
    const resolver = new dns.Resolver();

    const records = await resolver.resolve(name, type);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            domain: name,
            type: type,
            records: records,
          }),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DNS MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
