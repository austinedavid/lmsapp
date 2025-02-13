"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface IDeleteMessage {
  id: string;
}

const RemoveMessage: React.FC<IDeleteMessage> = ({ id }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete mutation
  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/get-intouch/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMessage"] });

      toast({
        variant: "default",
        title: "Success",
        description: "Message successfully deleted",
        className: "bg-green-500 text-white",
      });

      setLoading(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Message was not deleted",
      });

      setLoading(false);
    },
  });

  const handleDelete = () => {
    setLoading(true);
    mutate(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-dimOrange cursor-pointer absolute -translate-y-1/2 right-3 rounded-md text-white text-[12px] font-bold px-4 py-2 text-center lg:block">
          Delete Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-[500px] w-[380px] font-subtext">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Delete Message</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 font-header py-4">
          <div className="flex flex-1 items-center justify-center mx-auto gap-2">
            <Image
              src="/warn.png"
              alt="warning"
              width={50}
              height={50}
              className="w-[50px]"
            />
          </div>
          <div className="grid items-center font-header gap-4">
            <p className="font-bold text-[20px]">Are you sure you want to delete this message?</p>
            <p className="text-sm">
              This action cannot be reversed. Be sure you want to proceed before confirming.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-3 text-lg bg-lightGreen hover:bg-green-700"
          >
            {loading ? "Deleting..." : "Delete Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMessage;
