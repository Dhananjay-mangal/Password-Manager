import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';

const Content = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setForm] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setpasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const showpassword = () => {
        if (ref.current.src.includes("eye.png")) {
            ref.current.src = "/icons/eyecross.png"
            passwordRef.current.type = "password"
        }
        else {
            ref.current.src = "/icons/eye.png"
            passwordRef.current.type = "text"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newId = uuidv4();

            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: newId })
            });

            // Fix applied here
            setpasswordArray([...(Array.isArray(passwordArray) ? passwordArray : []), { ...form, id: newId }]);

            alert('Password Saved Successfully');
            setForm({ site: "", username: "", password: "" });
        } else {
            alert("Please fill all fields with more than 3 characters");
        }
    };



    const handlechange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const CopyText = (index) => {
        navigator.clipboard.writeText(index)
        // alert("Copied to clipboard")
    }

    const DeleteText = async (id) => {
        setpasswordArray(passwordArray.filter(item => item.id !== id))
        await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
        // alert("Deleted from clipboard")
    }

    const EditText = (id) => {
        let editItem = passwordArray.find(item => item.id === id)
        setForm({ site: editItem.site, username: editItem.username, password: editItem.password })
        DeleteText(id)
        // alert("Edited from clipboard")
    }

    return (
        <div>
            <div className="flex flex-col p-4 text-black gap-8 items-center">
                <input onChange={handlechange} value={form.site} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" id="site" />
                <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                    <input onChange={handlechange} value={form.username} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" id="username" />
                    <div className="relative">

                        <input onChange={handlechange} ref={passwordRef} value={form.password} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name="password" id="password" />
                        <span onClick={showpassword} className='absolute right-[3px] top-[4px] cursor-pointer'>
                            <img ref={ref} className='p-1' width={26} src="icons/eyecross.png" alt="eye" />
                        </span>
                    </div>

                </div>
                <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900'>
                    Save</button>
            </div>

            <div className='border-[1px] border-black-30 my-4 w-[70%] mx-auto'></div>

            <div className="passwords mx-auto">
                <h1 className='text-2xl font-bold text-center my-2'>Your Passwords</h1>
                {passwordArray.length === 0 && <p className='text-center'>No passwords saved yet</p>}
                {passwordArray.length > 0 &&
                    <table className='w-[90%] text-center border border-green-700 mx-auto rounded-md overflow-hidden mb-10'>
                        <thead className='bg-green-700 text-white py-2'>
                            <tr>
                                <th>Website</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-30'>
                            {passwordArray.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='w-32 py-1 text-center border-2 border-white'>
                                            <div className="flex justify-center items-center">
                                                <a href={item.site} target='_blank'>{item.site}</a>
                                                <button onClick={() => CopyText(item.site)} className='ml-2 cursor-pointer'><img width={16} src="/icons/copy.png" alt="" /></button>
                                            </div>
                                        </td>
                                        <td className='w-32 py-1 text-center border-2 border-white'>
                                            <div className="flex justify-center items-center">
                                                <span>{item.username}</span>
                                                <button onClick={() => CopyText(item.username)} className='ml-2 cursor-pointer'><img width={16} src="/icons/copy.png" alt="" /></button>
                                            </div>
                                        </td>
                                        <td className='w-32 py-1 text-center border-2 border-white'>
                                            <div className="flex justify-center items-center">
                                                <span>{item.password}</span>
                                                <button onClick={() => CopyText(item.password)} className='ml-2 cursor-pointer'><img width={16} src="/icons/copy.png" alt="" /></button>
                                            </div>
                                        </td>
                                        <td className='w-32 py-1 text-center border-2 border-white'>
                                            <div className="flex justify-center items-center">
                                                <button onClick={() => EditText(item.id)} className='ml-2 cursor-pointer'><img width={16} src="/icons/edit.png" alt="" /></button>
                                                <button onClick={() => DeleteText(item.id)} className='ml-2 cursor-pointer'><img width={16} src="/icons/bin.png" alt="" /></button>
                                            </div>
                                        </td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>}
            </div>
        </div>


    )
}

export default Content