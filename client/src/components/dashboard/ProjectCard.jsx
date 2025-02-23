import React, { useState } from "react";
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

const ProjectCard = ({ project, setProjects, projects }) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({
    name: project.name,
    description: project.description,
  });
  const { axiosPrivate } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject({ ...updatedProject, [name]: value });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosPrivate.put(
        `/project/${project.id}`,
        updatedProject
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Project updated successfully");
        setProjects(
          projects.map((p) =>
            p.id === project.id ? { ...p, ...updatedProject } : p
          )
        );
      }
    } catch (error) {
      toast.error("Error updating project");
      return;
    }
    setIsUpdateDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleDeleteProject = async () => {
    try {
      setProjects(projects.filter((p) => p.id !== project.id));
      const response = await axiosPrivate.delete(`/project/${project.id}`);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Project deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting project");
      return;
    }
  };

  return (
    <Card className="bg-zinc-500/[0.15]">
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <CardTitle>{project.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer -mt-[15px] focus-visible:outline-none focus-visible:border-none">
              <span className="text-[20px]">...</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-[5px]">
              <DropdownMenuItem
                className="hover:bg-zinc-800"
                onClick={() => setIsUpdateDialogOpen(true)}
              >
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 hover:bg-red-500 hover:text-[#fff]"
                onClick={() => handleDeleteProject(project.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{project.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <span>
          Created at: {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </CardFooter>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Project</DialogTitle>
            <DialogDescription>
              Update the project name and description.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              autoComplete="off"
              placeholder="Project Name"
              value={updatedProject.name}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={updatedProject.description}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <LoadingButton onClick={handleUpdateProject} loading={isSubmitting}>
              Update
            </LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectCard;
