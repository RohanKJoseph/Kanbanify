import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingButton } from "@/components/ui/loading-button";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { API_BASE_URL } from "@/lib/env";

const TaskCard = ({ card, projectId }) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const { axiosPrivate } = useAuth();

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (isUpdateDialogOpen) {
        try {
          const response = await axiosPrivate.get(
            `/project/${projectId}/cards/${card.id}`
          );
          if (response.data.error) {
            toast.error(response.data.error);
          } else {
            setCardDetails(response.data);
          }
        } catch (error) {
          toast.error("Error fetching card details");
        }
      }
    };

    fetchCardDetails();
  }, [isUpdateDialogOpen, projectId, card.id, axiosPrivate]);

  const handleDeleteTask = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/project/${projectId}/cards/${card.id}`
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Task deleted successfully");
        // Update projects state to remove the deleted task
        setProjects((prevProjects) => ({
          ...prevProjects,
          cards: {
            ...prevProjects.cards,
            [card.type]: {
              ...prevProjects.cards[card.type],
              cards: prevProjects.cards[card.type].cards.filter(
                (t) => t.id !== card.id
              ),
            },
          },
        }));
      }
    } catch (error) {
      toast.error("Error deleting task");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card
        className={`cursor-pointer bg-[#2E2D2D]`}
        onClick={() => setIsUpdateDialogOpen(true)}
      >
        <CardContent className="p-0">
          <div className="flex justify-between items-center -mt-3 px-4 pb-4 border-b-[2px] border-[#D9D9D9]">
            <CardTitle className="text-left text-xl">{card.title}</CardTitle>
            <Trash2
              className="hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            />
          </div>
          <CardDescription className="text-left p-2 text-md text-white px-4">
            {card.description}
          </CardDescription>
        </CardContent>
      </Card>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className={"bg-[#2E2D2D] overflow-hidden min-w-[50vw] min-h-[60vh]"}>
          <DialogHeader>
            <DialogTitle className={"text-left"}>{card.title}</DialogTitle>
            <DialogDescription>
              <div className="flex h-full">
                <div className="text-left w-2/3">
                  {card.description}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={18} className="mt-[5px]" />
                      <span className="text-lg">Comments</span>
                    </div>
                    <div className="space-y-2">
                      {console.log("card:", card, ",", cardDetails)}
                      {cardDetails?.card?.comments?.map((comment) => (
                        <div key={comment.id} className="pl-5">
                          <div className="flex items-center gap-2 text-sm text-gray-400"></div>
                          <p className="mt-1 text-white">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-1/3">
                  <div>
                    <div className="h-screen -top-[10vh] absolute w-[1px] bg-white" />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col justify-center items-start pl-5 w-full">
                      <div className="flex items-center ml-2 gap-5 text-[18px] ">
                        Assigned
                        <Plus size={18}/>
                      </div>
                      <div className="bg-white h-[1px] w-1/2 mt-[1px]" />
                    </div>
                    <div className="space-y-2">
                      {cardDetails?.card?.assigned?.map((assigned) => (
                        <div key={assigned.id} className="pl-5">
                          <div className="flex items-center gap-2 text-sm text-gray-400"></div>
                          <p className="mt-1 text-white">{assigned.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <LoadingButton variant="destructive" onClick={handleDeleteTask}>
              Delete
            </LoadingButton>
            <LoadingButton
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </LoadingButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
