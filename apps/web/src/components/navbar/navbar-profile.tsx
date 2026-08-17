"use client";
import { useRole } from "@/providers/role-provider";

const NavbarProfile = () => {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-300">View as:</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "STUDENT" | "TEACHER")}
        className="bg-gray-800 text-white text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 hover:cursor-pointer"
      >
        <option value="STUDENT">Student</option>
        <option value="TEACHER">Teacher</option>
      </select>
    </div>
  );
};

export default NavbarProfile;
