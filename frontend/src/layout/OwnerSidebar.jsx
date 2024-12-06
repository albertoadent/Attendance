import CreateClass from "../components/Classes/CreateClass";
import EditButton from "../components/Schools/EditSchoolButton";
import AddStudentByUsername from "../components/Students/AddStudentByUsername";
import DeleteSchoolButton from "../components/Schools/DeleteSchoolButton";

export default function OwnerSidebar({ schoolId }) {
  return (
    <div className="w-auto p-2 h-auto border flex flex-col items-center gap-2 bg-secondaryBackground">
      <h1>School Owner Tools</h1>
      <div className="flex w-full gap-2 justify-center">
        <EditButton schoolId={schoolId} />
        <DeleteSchoolButton id={schoolId} />
      </div>
      <h1>Add User to your School</h1>
      <AddStudentByUsername schoolId={schoolId} />
      <h1>Add a Class</h1>
      <CreateClass schoolId={schoolId} />
    </div>
  );
}
