// "use client"

// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { BadgeCheckIcon, ChevronsUpDownIcon, LogOutIcon } from "lucide-react"

// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { clearSession } from "@/lib/auth"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

// export function NavUser() {
//   const { isMobile } = useSidebar()
//   const router = useRouter()

//   function handleLogout() {
//     clearSession()
//     router.replace("/login")
//   }

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton size="lg">
//               <Avatar className="h-8 w-8 rounded-lg"><AvatarFallback className="rounded-lg">AC</AvatarFallback></Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-medium">Crate Inc</span>
//                 <span className="truncate text-xs text-muted-foreground">Frontend Preview</span>
//               </div>
//               <ChevronsUpDownIcon className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
//             <DropdownMenuLabel>Crate Inc</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem asChild><Link href="/profile"><BadgeCheckIcon />My Profile</Link></DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout}>
//               <LogOutIcon />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }
"use client"
 
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BadgeCheckIcon, ChevronsUpDownIcon, LogOutIcon } from "lucide-react"
 
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { clearSession } from "@/lib/auth"
import { useEmployeeAccess } from "@/components/employees/employee-access"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
 
export function NavUser() {
  const { role } = useEmployeeAccess();
  console.log(role, "--find a static role");
  const { isMobile } = useSidebar()
  const router = useRouter()
 
  function handleLogout() {
    clearSession()
    router.replace("/login")
  }
 
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg"><AvatarFallback className="rounded-lg">AC</AvatarFallback></Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Bex SCM</span>
                <span className="truncate text-xs text-muted-foreground">{role || "Owner" || "Role not assigned"}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel>Bex SCM</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild><Link href="/profile"><BadgeCheckIcon />My Profile</Link></DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}