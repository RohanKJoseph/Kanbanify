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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProjectCard = ({ project }) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({
    name: project.name,
    description: project.description,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProject({ ...updatedProject, [name]: value });
  };

  const handleUpdateProject = () => {
    console.log("Updating project:", updatedProject);
    // Add logic to update the project
    setIsUpdateDialogOpen(false);
  };

  return (
    <Card>
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
                onClick={() => console.log("Delete")}
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
            <DialogClose asChild>
              <Button onClick={handleUpdateProject}>Update</Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectCard;
