import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface GenerateTShirtRequest {
  t_shirt_type: string;
  t_shirt_size: string;
  apparel_type: string
  gender: string;
  t_shirt_color: string;
  age: number;
  t_shirt_theme: string;
  optional_description?: string;
  img_file?: File | null;
}


export interface GenerateTShirtResponse {
  success: boolean;
  message: string;
  generated_design_url: string;
  generated_mockup_url: string
}


export const tShirtApi = createApi({
  reducerPath: "tShirtApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://72.60.190.101:8000",
  }),
  endpoints: (builder) => ({
    generateTShirt: builder.mutation<
      GenerateTShirtResponse,
      GenerateTShirtRequest
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("t_shirt_type", body.t_shirt_type);
        formData.append("t_shirt_size", body.t_shirt_size);
        formData.append("apparel_type", body.apparel_type);
        formData.append("gender", body.gender);
        formData.append("t_shirt_color", body.t_shirt_color);
        formData.append("age", body.age.toString());
        formData.append("t_shirt_theme", body.t_shirt_theme);
        if (body.optional_description) {
          formData.append("optional_description", body.optional_description);
        }
        if (body.img_file) {
          formData.append("img_file", body.img_file);
        }


        return {
          url: "/t_shirt_generate",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});


export const { useGenerateTShirtMutation } = tShirtApi;


// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export interface GenerateTShirtRequest {
//   t_shirt_type: string; 
//   t_shirt_size: string; 
//   gender: string; 
//   t_shirt_color: string; 
//   age: number;
//   t_shirt_theme: string; 
//   optional_description?: string;
//   img_file?: File | null;
// }

// export interface GenerateTShirtResponse {
//   success: boolean;
//   message: string;
//   generated_design_url: string; 
//   generated_mockup_url: string
// }

// export const tShirtApi = createApi({
//   reducerPath: "tShirtApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://72.60.190.101:8000", 
//   }),
//   endpoints: (builder) => ({
//     generateTShirt: builder.mutation<
//       GenerateTShirtResponse,
//       GenerateTShirtRequest
//     >({
//       query: (body) => {
//         const formData = new FormData();
//         formData.append("t_shirt_type", body.t_shirt_type);
//         formData.append("t_shirt_size", body.t_shirt_size);
//         formData.append("gender", body.gender);
//         formData.append("t_shirt_color", body.t_shirt_color);
//         formData.append("age", body.age.toString());
//         formData.append("t_shirt_theme", body.t_shirt_theme);
//         if (body.optional_description) {
//           formData.append("optional_description", body.optional_description);
//         }
//         if (body.img_file) {
//           formData.append("img_file", body.img_file);
//         }

//         return {
//           url: "/t_shirt_generate",
//           method: "POST",
//           body: formData,
//         };
//       },
//     }),
//   }),
// });

// export const { useGenerateTShirtMutation } = tShirtApi;
