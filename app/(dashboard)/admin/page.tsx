import { redirect } from "next/navigation";

const Admin = () => {
    redirect('/admin/dashboard')
    return (
        <div>
            <h1>Admin</h1>
        </div>
    );
};
export default Admin;