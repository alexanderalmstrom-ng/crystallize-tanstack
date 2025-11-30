import { env } from "@/env";
import type { TypedDocumentString as CartTypedDocumentString } from "@/gql/cart/graphql";
import type { TypedDocumentString as DiscoveryTypedDocumentString } from "@/gql/discovery/graphql";
import { crystallizeResponseSchema } from "./schema";

type CrystallizeEndpoint = "discovery" | "auth/token" | "cart";

type CrystallizeDiscoveryClientProps<TResult, TVariables> = {
  api?: "api";
  endpoint: CrystallizeEndpoint;
  query: DiscoveryTypedDocumentString<TResult, TVariables>;
  variables?: TVariables;
  headers?: Record<string, string>;
};

type CrystallizeCartClientProps<TResult, TVariables> = {
  api?: "shop-api";
  endpoint: CrystallizeEndpoint;
  query: CartTypedDocumentString<TResult, TVariables>;
  variables?: TVariables;
  headers?: Record<string, string>;
};

type CrystallizeDiscoveryApiProps<TResult, TVariables> = Omit<
  CrystallizeDiscoveryClientProps<TResult, TVariables>,
  "api" | "endpoint"
>;

type CrystallizeCartApiProps<TResult, TVariables> = Omit<
  CrystallizeCartClientProps<TResult, TVariables>,
  "api" | "endpoint"
>;

export function crystallizeDiscovery<TResult, TVariables>(
  props: CrystallizeDiscoveryApiProps<TResult, TVariables>,
) {
  return crystallizeClient<TResult, TVariables>({
    ...props,
    endpoint: "discovery",
  });
}

export function crystallizeCart<TResult, TVariables>(
  props: CrystallizeCartApiProps<TResult, TVariables>,
) {
  return crystallizeClient<TResult, TVariables>({
    ...props,
    api: "shop-api",
    endpoint: "cart",
  });
}

async function crystallizeClient<TResult, TVariables>({
  api = "api",
  endpoint,
  query,
  variables,
  headers,
}:
  | CrystallizeDiscoveryClientProps<TResult, TVariables>
  | CrystallizeCartClientProps<TResult, TVariables>) {
  const response = await fetch(
    `https://${api}.crystallize.com/${env.CRYSTALLIZE_TENANT_IDENTIFIER}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": env.CRYSTALLIZE_ACCESS_TOKEN_ID,
        "X-Crystallize-Access-Token-Secret":
          env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
        ...(headers || {}),
      },
      body: JSON.stringify({
        query: query.toString(),
        variables: variables || undefined,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Crystallize API error:", errorData);
    throw new Error(`Failed to fetch Crystallize API: ${response.statusText}`);
  }

  const json = await response.json();
  const validation = crystallizeResponseSchema<TResult>().safeParse(json);

  if (!validation.success) {
    console.error("Validation error:", validation.error);
    throw new Error(
      `Failed to validate Crystallize API response: ${validation.error.message}`,
    );
  }

  const validatedData = validation.data;

  // Throw if there are GraphQL errors
  if (validatedData.errors && validatedData.errors.length > 0) {
    const errorMessages = validatedData.errors
      .map((error) => error.message)
      .join(", ");
    throw new Error(`Crystallize GraphQL errors: ${errorMessages}`);
  }

  return {
    data: validatedData.data,
    errors: validatedData.errors,
  };
}
