import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
interface Project {
  projectId: number;
  projectName: string;
  projectCode: string;
}

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>("https://localhost:7100/api/Project");
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">List of Projects</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-600 px-4 py-2 text-left">Project ID</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Project Name</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Project Code</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.projectId} className="hover:bg-gray-700">
                <td className="border border-gray-600 px-4 py-2">{project.projectId}</td>
                <td className="border border-gray-600 px-4 py-2">{project.projectName}</td>
                <td className="border border-gray-600 px-4 py-2">{project.projectCode}</td>
                <td className="border border-gray-600 px-4 py-2">
                  <Link
                    to={`/projects/${project.projectId}`}
                    className="text-blue-400 hover:underline"
                  >
                    View Staff
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectPage;
