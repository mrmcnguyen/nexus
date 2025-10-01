"use server";
import { 
  createProject, 
  getAllProjects, 
  getProjectByID, 
  getSectors, 
  getMembers, 
  getProjectManager, 
  getNameFromEmail, 
  getNameFromID, 
  addMembertoProject 
} from "../lib/db/projectQueries";

// Project Management Server Actions

export async function createProjectAction(projectName: string, organisationName: string, projectDescription: string, projectManager: string) {
  return await createProject(projectName, organisationName, projectDescription, projectManager);
}

export async function getAllProjectsAction(userId: string) {
  return await getAllProjects(userId);
}

export async function getProjectByIDAction(projectId: string) {
  return await getProjectByID(projectId);
}

export async function getSectorsAction(projectId: string) {
  return await getSectors(projectId);
}

export async function getMembersAction(projectId: string) {
  return await getMembers(projectId);
}

export async function getProjectManagerAction(userId: string) {
  return await getProjectManager(userId);
}

export async function getNameFromEmailAction(email: string) {
  return await getNameFromEmail(email);
}

export async function getNameFromIDAction(userId: string) {
  return await getNameFromID(userId);
}

export async function addMembertoProjectAction(invitationId: string, recipientId: string, senderId: string, projectId: string) {
  return await addMembertoProject(invitationId, recipientId, senderId, projectId);
}
