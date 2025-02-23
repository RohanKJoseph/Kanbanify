import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-button";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const { axiosPrivate } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const fetchProjects = async () => {
    try {
      const response = await axiosPrivate.get("/project");
      console.log(response.data);
      setProjects(response.data?.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Error fetching projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosPrivate.post("/project/create", newProject);
      if (response.data.error) {
        toast.error(response.data.error);
        setIsSubmitting(false);
      } else {
        setProjects([...projects, response.data.project]);
        toast.success("Project created successfully");
        setIsSubmitting(false);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Error creating project");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-[50px]">
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setNewProject({ name: "", description: "" });
        }}
      >
        <DialogTrigger asChild>
          <Card className="border-dashed border-2 border-[#afafaf] flex justify-center items-center bg-zinc-500/[.13] cursor-pointer">
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
            <LoadingButton onClick={handleCreateProject} loading={isSubmitting}>
              Create
            </LoadingButton>
          </form>
        </DialogContent>
      </Dialog>
      {projects &&
        projects.map((project) => (
          <div 
            onClick={() => {
              console.log(project.id);
              navigate(`/${project.id}`);
            }} 
            key={project.id}
          >
            <ProjectCard
              key={project.id}
              project={project}
              setProjects={setProjects}
              projects={projects}
            />
          </div>
        ))}
    </div>
  );
};

export default DashBoard;
