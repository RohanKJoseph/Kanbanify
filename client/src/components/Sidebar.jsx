import { SquareKanban, Bolt, LogOut } from "lucide-react";
import Logo from "@/assets/logo.svg";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = ({ onHoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    onHoverChange(isHovered);
  }, [isHovered, onHoverChange]);

  return (
    <div
      className="pt-5 flex flex-col justify-start items-center h-screen bg-black border-r-2 border-zinc-400 transition-all duration-300 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="transition-all duration-500 flex items-end">
        <img
          src={Logo}
          className="transition-all duration-500 w-[60px]"
          alt="logo"
        />
        {isHovered && <p className="tracking-[-1px] -ml-4 -mb-1">KANBANIFY</p>}
      </div>
      <div className="flex flex-col items-center mt-10 space-y-10">
        <a href="/" className="flex items-center gap-3 mb-[55vh]">
          <SquareKanban size="35" />
          {isHovered && <p className="text-[18px]">Projects</p>}
        </a>
        <div className="flex items-center gap-3">
          <Bolt size="35" />
          {isHovered && <p className="text-[18px]">Settings</p>}
        </div>
        <a
          href="#"
          onClick={logout}
          className="flex items-center gap-3 cursor-pointer"
        >
          <LogOut size="35" />
          {isHovered && <p className="text-[18px]">Logout</p>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
