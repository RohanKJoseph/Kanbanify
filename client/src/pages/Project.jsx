import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { API_BASE_URL } from "@/lib/env";
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

function Project() {
  const { projectId } = useParams()
  const { axiosPrivate } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [newTaskType, setNewTaskType] = useState('')
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [selectedColumnId, setSelectedColumnId] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosPrivate.get(`${API_BASE_URL}/project/${projectId}`)
        setProject(response.data.project)
      } catch (error) {
        toast.error('Error fetching project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleInviteUser = async () => {
    try {
      const response = await axiosPrivate.post(`${API_BASE_URL}/project/${projectId}/invite`, {
        email: inviteEmail
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Invitation sent successfully');
        setInviteEmail('');
      }
    } catch (error) {
      toast.error('Error sending invitation');
    }
  };

  const handleAddTaskType = async () => {
    try {
      const response = await axiosPrivate.post(`${API_BASE_URL}/project/${projectId}/types`, {
        name: newTaskType
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Task type added successfully');
        setNewTaskType('');
        const projectResponse = await axiosPrivate.get(`${API_BASE_URL}/project/${projectId}`);
        setProject(projectResponse.data.project);
      }
    } catch (error) {
      toast.error('Error adding task type');
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await axiosPrivate.post(`${API_BASE_URL}/project/${projectId}/cards`, {
        title: newTaskTitle,
        description: newTaskDescription,
        typeId: selectedColumnId
      });
      
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Task added successfully');
        setNewTaskTitle('');
        setNewTaskDescription('');
        setIsNewTaskModalOpen(false);
        const projectResponse = await axiosPrivate.get(`${API_BASE_URL}/project/${projectId}`);
        setProject(projectResponse.data.project);
      }
    } catch (error) {
      toast.error('Error adding task');
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>
  }

  if (!project) {
    return <div className="h-screen flex items-center justify-center bg-black text-white">Project not found</div>
  }

  return (
    <div className="h-screen overflow-hidden bg-black">     
      <div className="flex h-[calc(100vh-120px)] mr-[300px]">
        {Object.values(project.cards)
          .sort((a, b) => a.type.position - b.type.position)
          .map((column, index, array) => (
            <React.Fragment key={column.type.id}>
              <div className="flex-1 text-center min-w-[300px]">
                <h2 className="font-semibold p-4 pt-10 text-4xl text-white">{column.type.name}</h2>
                <div className="flex flex-col gap-4 p-4">
                  {column.cards.map(card => (
                    <div key={card.id}>
                      <TaskCard card={card} projectId={projectId}/>
                    </div>
                  ))}
                  <Button
                    className="w-full bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2 text-white"
                    onClick={() => {
                      setSelectedColumnId(column.type.id);
                      setIsNewTaskModalOpen(true);
                    }}
                  >
                    <Plus size={18} />
                    Add Task
                  </Button>
                </div>
              </div>
              {index < array.length - 1 && (
                <div className="w-[2px] h-screen bg-zinc-800"></div>
              )}
            </React.Fragment>
          ))}
          
        <div className="flex-1 text-center min-w-[300px] fixed right-0 bg-black h-screen border-l-zinc-800 border-l-2">
          <h2 className="font-semibold p-4 pt-10 text-4xl text-white">Manage</h2>
          <div className="flex flex-col gap-6 p-4">     
            <div className="bg-zinc-900 rounded-lg shadow-md p-6">
              <h3 className="font-medium text-xl mb-4 text-white">Invite User</h3>
              <div className="flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-black border-zinc-800"
                />
                <Button 
                  onClick={handleInviteUser}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2 text-white"
                  disabled={!inviteEmail}
                >
                  <UserPlus size={18} />
                  Send Invite
                </Button>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg shadow-md p-6">
              <h3 className="font-medium text-xl mb-4 text-white">Add Task Type</h3>
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="Enter task type name"
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value)}
                  className="bg-black border-zinc-800"
                />
                <Button 
                  onClick={handleAddTaskType}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2 text-white"
                  disabled={!newTaskType}
                >
                  <Plus size={18} />
                  Add Type
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isNewTaskModalOpen} onOpenChange={setIsNewTaskModalOpen}>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-black border-zinc-800"
            />
            <Textarea
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="bg-black border-zinc-800"
            />
            <Button
              onClick={handleAddTask}
              className="w-full bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2 text-white"
              disabled={!newTaskTitle || !newTaskDescription}
            >
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Project