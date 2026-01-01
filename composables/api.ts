import type { JsonSchema7 } from "@jsonforms/core";
import type { IPBaseObject } from "~/utils/types/CommonProperties";
import type {
  PaginationParameter,
  PaginationResult,
  SearchParameter
} from "~/utils/types/APIInterfaces";

/**
 * Get all mapping items belonging to a given category.
 * @param category The category of the mapping items.
 * @param params Parameter to influence the result set
 *    limit Optional: restrict the result set to a specific number
 *    offset Optional: retrieving the result set starting with a given offset
 */
export const getCategory = (
  category: string,
  params: PaginationParameter = {}
) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return useFetch<PaginationResult>(`/MappingItem/categories/${category}`, {
    key: `${category}/${params?.offset}/${params?.limit}`,
    baseURL: apiBaseUrl,
    method: "get",
    parseResponse: JSON.parse,
    params,
  });
};

export const getCategories = () => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return useFetch<[]>(`/Schema`, {
    baseURL: apiBaseUrl,
    method: "get",
    parseResponse: JSON.parse,
  });
};

/**
 * Retrieve a specific mapping item by id.
 * @param id The id of the item.
 */
export const getItem = (id: string) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return useFetch<IPBaseObject>(`/MappingItem/${id}`, {
    key: id,
    baseURL: apiBaseUrl,
    method: "get",
    parseResponse: JSON.parse,
  });
};

export const validate = (data: IPBaseObject, schema: string) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return $fetch(`/Schema/validate/${schema}`, {
    baseURL: apiBaseUrl,
    method: "post",
    body: data,
    parseResponse: JSON.parse,
  });
};

export const patchItem = (item: IPBaseObject, userToken: string) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return $fetch(`/MappingItem/${item._id}`, {
    baseURL: apiBaseUrl,
    method: "patch",
    body: item,
    headers: {
      Authorization: "Bearer " + userToken,
    },
    parseResponse: JSON.parse,
  });
};

export const createItem = (item: IPBaseObject, userToken: string) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return $fetch<IPBaseObject>(`/MappingItem`, {
    baseURL: apiBaseUrl,
    method: "post",
    body: item,
    headers: {
      Authorization: "Bearer " + userToken,
    },
    parseResponse: JSON.parse,
  });
};

/**
 * Retrieve a specific mapping item by id.
 * @param schema The name of the schema.
 */
export const getSchema = (schema: string) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return useFetch<JsonSchema7>(`/Schema/${schema}`, {
    key: schema,
    baseURL: apiBaseUrl,
    method: "get",
    parseResponse: JSON.parse,
  });
};

/**
 * Search for mapping items given a 'searchText'. The search can be restricted to a specific hub.
 * @param params SearchParameter for the requested search.
 */
export const search = (
  params: SearchParameter
) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  return useFetch<PaginationResult>(`/MappingItem/search`, {
    baseURL: apiBaseUrl,
    method: "get",
    parseResponse: JSON.parse,
    params,
  });
};

export const login = (username: string, password: string) => {
  const {
    public: { apiBaseUrl },
  } = useRuntimeConfig();

  const formData = new FormData();
  formData.set("username", username);
  formData.set("password", password);

  return $fetch<{ access_token: string }>(`/auth/login`, {
    baseURL: apiBaseUrl,
    method: "post",
    body: formData,
    parseResponse: JSON.parse,
  });
};
