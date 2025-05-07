import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const domainApi = createApi({
  reducerPath: "domainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://6797aa2bc2c861de0c6d964c.mockapi.io/domain",
  }),
  tagTypes: ["Domain"],
  endpoints: (builder) => ({
    getDomains: builder.query({
      query: () => "",
      providesTags: ["Domain"],
    }),

    getDomainById: builder.query({
      query: (id) => `/${id}`,
    }),

    addDomain: builder.mutation({
      query: (newDomain) => ({
        url: "",
        method: "POST",
        body: {
          createdDate: newDomain.createdDate || Math.floor(Date.now() / 1000),
          domain: newDomain.domain,
          status: newDomain.status || "unverified",
          isActive:
            newDomain.isActive !== undefined ? newDomain.isActive : true,
        },
      }),
      invalidatesTags: ["Domain"],
    }),

    updateDomain: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Domain"],
    }),

    deleteDomain: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Domain"],
    }),
  }),
});

export const {
  useGetDomainsQuery,
  useGetDomainByIdQuery,
  useAddDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
} = domainApi;
