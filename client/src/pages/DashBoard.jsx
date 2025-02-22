import React, { useState } from "react";
import ProjectCard from "../components/dashboard/ProjectCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const projects = [
  {
    id: 1,
    name: "Project 1",
    description: "Description for project 1",
    createdAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Project 2",
    description: "Description for project 2",
    createdAt: "2023-02-01",
  },
  {
    id: 3,
    name: "Project 3",
    description: "Description for project 3",
    createdAt: "2023-03-01",
  },
  {
    id: 4,
    name: "Project 4",
    description: "Description for project 4",
    createdAt: "2023-04-01",
  },
  {
    id: 5,
    name: "Project 5",
    description: "Description for project 5",
    createdAt: "2023-05-01",
  },
  {
    id: 6,
    name: "Project 6",
    description: "Description for project 6",
    createdAt: "2023-06-01",
  },
  {
    id: 7,
    name: "Project 7",
    description: "Description for project 7",
    createdAt: "2023-07-01",
  },
  {
    id: 8,
    name: "Project 8",
    description: "Description for project 8",
    createdAt: "2023-08-01",
  },
];

const DashBoard = () => {
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleCreateProject = () => {
    console.log("Creating project:", newProject);
    // Add logic to create the project
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-[50px]">
      <Dialog onOpenChange={() => setNewProject({ name: "", description: "" })}>
        <DialogTrigger asChild>
          <Card className="border-dashed border-2 border-[#afafaf] flex justify-center items-center bg-[#3d7afd]/[0.10] cursor-pointer">
            <CardContent>
              <h1 className="opacity-100">Create New Project</h1>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Please enter the project name and description.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              autoComplete="off"
              placeholder="Project Name"
              value={newProject.name}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={newProject.description}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <DialogClose asChild>
              <Button onClick={handleCreateProject}>Create</Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default DashBoard;
