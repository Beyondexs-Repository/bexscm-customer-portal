import RolesAndPermissions from "../../../components/backoffice/RolesPermissions/RolesAndPermissions";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-2 sm:gap-4 sm:p-4">
      <RolesAndPermissions />
    </div>
  );
}
