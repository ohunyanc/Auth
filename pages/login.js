import Head from "next/head";
import styles from '../styles/Form.module.css'
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import Layout from "@/layout/layout";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signIn, signOut } from 'next-auth/react'
import { useFormik } from "formik";
import login_validate from "@/lib/validate";
import { useRouter } from "next/router";

export default function Login() {

    const [show, setShow] = useState(false)
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate: login_validate,
        onSubmit
    })
    console.log(formik.errors)

    async function onSubmit(values) {
        try {
            const status = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: "/"
            });
    
            if (status?.ok) {
                router.push(status.url);
            } else {
                // Handle authentication error
                console.error("Authentication failed:", status?.error || "Unknown error");
                // You might want to display an error message to the user here
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle any unexpected errors
            // You might want to display an error message to the user here
        }
    }
    

    //google handler function
    async function handleGoogleSignin() {
        signIn('google', { callbackUrl: "http://localhost:3000" })
    }

    async function handleGithubSignin() {
        signIn('github', { callbackUrl: "http://localhost:3000" })
    }

    return (
        <Layout>

            <Head>
                <title>Login page</title>
            </Head>

            <section className="w-3/4 mx-auto flex flex-col gap-10">
                <div className="title">
                    <h1 className="text-gray-600 text-4xl font-bold py-4">Explore</h1>
                    <p className="w-3/4 mx-auto text-gray-500">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                {/* form */}
                <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
                    <div className={`${styles.input_group} ${formik.errors.email && formik.touched.email?"border-rose-800":""}`}>
                        <input type="email" name="email" placeholder="Email" className={styles.input_text} {...formik.getFieldProps('email')} />
                        <span className="icon flex items-center px-4">
                            <HiAtSymbol size={25} />
                        </span>
                    </div>

                    {formik.errors.email && formik.touched.email ? <span className="text-sm font-light text-rose-600">{formik.errors.email}</span> : <></>}
                    <div className={`${styles.input_group} ${formik.errors.password && formik.touched.password?"border-rose-800":""}`}>
                        <input type={`${show ? "text" : "password"}`} name="password" placeholder="Password" className={styles.input_text} {...formik.getFieldProps('password')} />
                        <span className="icon flex items-center px-4" onClick={() => setShow(!show)}>
                            <HiFingerPrint size={25} />
                        </span>
                    </div>

                    {formik.errors.password && formik.touched.password ? <span className="text-sm font-light text-rose-600">{formik.errors.password}</span> : <></>}

                    {/* login buttons */}
                    <div className="input-button">
                        <button type="submit" className={styles.button}>Login</button>
                    </div>
                    <div className="input-button">
                        <button type="button" onClick={handleGoogleSignin} className={styles.button_custom}>Sign In with Google <Image src={"/assets/google.svg"} alt="image" width={20} height={20} /></button>
                    </div>
                    <div className="input-button">
                        <button type="button" onClick={handleGithubSignin} className={styles.button_custom}>Sign In with Github <Image src={"/assets/github.svg"} alt="image" width={25} height={25} /></button>
                    </div>
                </form>
                {/* bottom */}
                <p className="text-center text-gray-800">don&apos;t have an account yet?<Link href={"/register"} className="text-green-800"> Register</Link></p>
            </section>
        </Layout>
    )
}