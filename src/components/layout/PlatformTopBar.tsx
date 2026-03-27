import { useNavigate } from "react-router-dom";
import { ChevronDown, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface PlatformTopBarProps {
  title: string;
  subtitle?: string;
}

export function PlatformTopBar({ title, subtitle }: PlatformTopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 border-b border-violet-500/20 bg-[#0f172a]/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
            <Badge
              variant="outline"
              className="border-violet-500/50 text-violet-200 bg-violet-500/10 font-normal text-xs"
            >
              Super Administrator
            </Badge>
          </div>
          {subtitle ? (
            <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-white/10"
            title="Platform help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2 px-2 text-slate-200 hover:bg-white/10"
              >
                <Avatar className="h-8 w-8 ring-2 ring-violet-500/30">
                  <AvatarFallback className="bg-violet-600/30 text-violet-100 text-xs font-semibold">
                    {user?.name?.slice(0, 2).toUpperCase() ?? "SA"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left max-w-[140px]">
                  <p className="text-sm font-medium text-white truncate">{user?.name ?? "User"}</p>
                  <p className="text-[11px] text-violet-300/90 truncate">Full platform access</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0f172a] border-white/10 text-slate-200">
              <DropdownMenuLabel className="text-slate-400 font-normal text-xs">
                Signed in as platform operator
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-red-300 focus:text-red-200 focus:bg-red-950/50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
