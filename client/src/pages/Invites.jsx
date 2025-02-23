import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Invites = () => {
  const { axiosPrivate } = useAuth();
  const [invites, setInvites] = useState([]);
  const [projects, setProjects] = useState({});

  const fetchInvites = async () => {
    try {
      const response = await axiosPrivate.get("/project/invites");
      setInvites(response.data.invites);
      response.data.invites.forEach((invite) => {
        fetchProjectName(invite.projectId);
      });
    } catch (error) {
      console.error("Error fetching invites:", error);
      toast.error("Error fetching invites");
    }
  };

  const fetchProjectName = async (projectId) => {
    try {
      const response = await axiosPrivate.get(`/project/${projectId}`);
      setProjects((prevProjects) => ({
        ...prevProjects,
        [projectId]: response.data.project.name,
      }));
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleAcceptInvite = async (projectId) => {
    try {
      const response = await axiosPrivate.put(
        `/project/${projectId}/accept-invite`
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Invite accepted successfully");
        setInvites(invites.filter((invite) => invite.projectId !== projectId));
      }
    } catch (error) {
      toast.error("Error accepting invite");
    }
  };

  const handleDeclineInvite = async (projectId) => {
    try {
      const response = await axiosPrivate.post(
        `/project/${projectId}/decline-invite`
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Invite declined successfully");
        setInvites(invites.filter((invite) => invite.projectId !== projectId));
      }
    } catch (error) {
      toast.error("Error declining invite");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Invites</h1>
      {invites.length === 0 ? (
        <p>No invites available</p>
      ) : (
        invites.map((invite) => (
          <div
            key={invite.id}
            className="flex justify-between items-center p-4 mb-2 bg-zinc-900 rounded w-3/4 mx-auto"
          >
            <div>
              <p className="text-lg">{projects[invite.projectId]}</p>
              <p className="text-sm text-gray-400">{invite.inviterEmail}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAcceptInvite(invite.projectId)}
                className="bg-green-500 hover:bg-green-600"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleDeclineInvite(invite.projectId)}
                className="bg-red-500 hover:bg-red-600"
              >
                Decline
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Invites;
