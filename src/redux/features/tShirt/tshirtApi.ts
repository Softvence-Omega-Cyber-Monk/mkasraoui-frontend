// src/redux/features/tshirt/tShirtApi.ts
import { baseApiForAi } from "@/redux/hooks/baseApiforAi";
import type { TShirtRequest, TShirtResponse } from "@/redux/types/tshirt.type";

export const tShirtApi = baseApiForAi.injectEndpoints({
  endpoints: (builder) => ({
    generateTShirt: builder.mutation<TShirtResponse, TShirtRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("t_shirt_type", data.t_shirt_type);
        formData.append("t_shirt_size", data.t_shirt_size);
        formData.append("gender", data.gender);
        formData.append("t_shirt_color", data.t_shirt_color);
        formData.append("age", String(data.age));
        formData.append("t_shirt_theme", data.t_shirt_theme);

        if (data.optional_description) {
          formData.append("optional_description", data.optional_description);
        }
        if (data.img_file) {
          formData.append("img_file", data.img_file);
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
