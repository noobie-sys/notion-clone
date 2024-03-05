"use client";
import { Spinner } from "@/components/spinner/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "./modal/confirm-modal";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");
  const filterDocument = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restored note!",
    });
  };
  const onRemove = (documentId: Id<"documents">) => {
    try {
      const promise = remove({ id: documentId });
      toast.promise(promise, {
        loading: "Removing note...",
        success: "Note removed!",
        error: "Failed to remove note!",
      });
      // if(promis)
      if (params.documentId === documentId) {
        router.push(`/documents`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }
  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 ">
        <Search className="w-4 h-4" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title.."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-sm text-center text-muted-foreground pb-2">
          No document found..
        </p>
        {filterDocument?.map((document) => (
          <div
            key={document._id}
            role="button"
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center justify-between text-primary"
            onClick={() => onClick(document._id)}
          >
            <span className="truncate pl-2">{document?.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document._id)}
                role="button"
                className="rounded-sm hover:bg-neutral-200 p-2"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                //   onClick={() => onRemove(document._id)}
                  className="rounded-sm hover:bg-neutral-200 p-2"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
