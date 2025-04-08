import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Website } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WebsiteContextProps {
  websites: Website[] | undefined;
  isLoading: boolean;
  error: Error | null;
  fetchWebsites: () => void;
  createWebsiteMutation: ReturnType<typeof useCreateWebsite>;
  updateWebsiteMutation: ReturnType<typeof useUpdateWebsite>;
  deleteWebsiteMutation: ReturnType<typeof useDeleteWebsite>;
}

type CreateWebsiteInput = {
  description: string;
  name?: string;
};

type UpdateWebsiteInput = {
  id: number;
  name?: string;
  description?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  instruction?: string;
};

const WebsiteContext = createContext<WebsiteContextProps | null>(null);

function useCreateWebsite() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (websiteData: CreateWebsiteInput) => {
      const res = await apiRequest("POST", "/api/websites/generate", websiteData);
      return await res.json() as Website;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Website created",
        description: "Your new website has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create website",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useUpdateWebsite() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (websiteData: UpdateWebsiteInput) => {
      const { id, ...data } = websiteData;
      const res = await apiRequest("PATCH", `/api/websites/${id}`, data);
      return await res.json() as Website;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Website updated",
        description: "Your website has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update website",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useDeleteWebsite() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/websites/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Website deleted",
        description: "Your website has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete website",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function WebsiteProvider({ children }: { children: ReactNode }) {
  const {
    data: websites,
    error,
    isLoading,
    refetch: fetchWebsites,
  } = useQuery<Website[], Error>({
    queryKey: ["/api/websites"],
  });

  const createWebsiteMutation = useCreateWebsite();
  const updateWebsiteMutation = useUpdateWebsite();
  const deleteWebsiteMutation = useDeleteWebsite();

  return (
    <WebsiteContext.Provider
      value={{
        websites,
        isLoading,
        error: error || null,
        fetchWebsites,
        createWebsiteMutation,
        updateWebsiteMutation,
        deleteWebsiteMutation,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  const context = useContext(WebsiteContext);
  if (!context) {
    // If the context is not provided, create and return the hooks directly
    const {
      data: websites,
      error,
      isLoading,
      refetch: fetchWebsites,
    } = useQuery<Website[], Error>({
      queryKey: ["/api/websites"],
    });

    return {
      websites,
      isLoading,
      error: error || null,
      fetchWebsites,
      createWebsiteMutation: useCreateWebsite(),
      updateWebsiteMutation: useUpdateWebsite(),
      deleteWebsiteMutation: useDeleteWebsite(),
    };
  }
  return context;
}
