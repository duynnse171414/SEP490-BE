import {  postData } from "@/api/fetchers";
import useSWR from "swr";
import { ClaimRequestRequireDTO } from "../type";

export const useCreateClaims = (payload: ClaimRequestRequireDTO | null) => {
    return useSWR(
        payload ? ["/ClaimRequests", payload] : null,
        payload => postData("/ClaimRequests", payload)
      );
  };