import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import apiClient from "../apiClient";
import { setUserContents } from "@/redux/contentsSlice";

export const useUserContents = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchUserContents = async () => {
      try {
        const res = await apiClient.get("/content");
        dispatch(setUserContents(res.data.data));
      } catch (error) {
        console.log("Error fetching contents:", error);
      }
    };
    fetchUserContents();
  }, [dispatch]);
};
