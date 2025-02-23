import React, { useState, useEffect } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskCard = ({ card, projectId }) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const { axiosPrivate } = useAuth();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [isAssigningMember, setIsAssigningMember] = useState(false);

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

  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (isAssignDialogOpen) {
        try {
          const response = await axiosPrivate.get(`/project/${projectId}/members`);
          if (response.data.error) {
            toast.error(response.data.error);
          } else {
            setProjectMembers(response.data.members);
          }
        } catch (error) {
          toast.error("Error fetching project members");
        }
      }
    };

    fetchProjectMembers();
  }, [isAssignDialogOpen, projectId, axiosPrivate]);

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

  const handleAssignMember = async () => {
    setIsAssigningMember(true);
    try {
      const response = await axiosPrivate.post(
        `/project/${projectId}/cards/${card.id}/assign`,
        { email: selectedMember?.email }
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Member assigned successfully");
        // Fetch updated card details
        const cardResponse = await axiosPrivate.get(
          `/project/${projectId}/cards/${card.id}`
        );
        if (!cardResponse.data.error) {
          setCardDetails(cardResponse.data);
        }
        setIsAssignDialogOpen(false);
      }
    } catch (error) {
      toast.error("Error assigning member");
    } finally {
      setIsAssigningMember(false);
    }
  };

  return (
    <>
      <Card
        className={`cursor-pointer bg-zinc-800`}
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
        <DialogContent
          className={" overflow-hidden min-w-[70vw] min-h-[80vh]"}
        >
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
                      {cardDetails?.card?.comments?.map((comment) => (
                        <div key={comment.id} className="pl-5">
                          <div className="flex items-center gap-2 text-sm text-zinc-400"></div>
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
                      <div className="flex items-center justify-between w-full pr-5 mb-3">
                        <span className="text-lg font-semibold">
                          Assigned Members
                        </span>
                        <button 
                          className="hover:bg-zinc-700 p-1.5 rounded-full transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="bg-zinc-600 h-[1px] w-full opacity-30" />
                    </div>
                    <div className="space-y-2 mt-4 pl-5">
                      {cardDetails?.card?.assigned?.map((assigned) => (
                        <div
                          key={assigned.id}
                          className="flex items-center gap-3 pl-2 py-2 hover:bg-zinc-700/50 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                            <img
                              src={assigned.profileUrl}
                              alt={assigned.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <p className="text-white text-base">{assigned.name}</p>
                        </div>
                      ))}
                      {(!cardDetails?.card?.assigned ||
                        cardDetails.card.assigned.length === 0) && (
                        <p className="text-zinc-400 text-sm pl-5">
                          No members assigned
                        </p>
                      )}
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

      <Dialog
        open={isAssignDialogOpen}
        onOpenChange={() => {
          setSelectedMember(null);
          setIsAssignDialogOpen(!isAssignDialogOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Member</DialogTitle>
            <DialogDescription>
              Select a member to assign to this task
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={setSelectedMember} value={selectedMember}>
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {projectMembers.map((member) => (
                <SelectItem key={member.id} value={member}>
                  {member.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-4 mt-4">
            <LoadingButton onClick={handleAssignMember} loading={isAssigningMember}>
              Assign
            </LoadingButton>
            <LoadingButton
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
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
