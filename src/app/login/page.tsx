"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import apiClient from "../_services/api";
import { useLayoutStore } from "../_store/viewStore";
import { useAuthStore } from "../_store/authStore";

const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  const { data } = await apiClient.post("/api/auth/login", credentials);
  return data;
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const headerHeight = useLayoutStore((state) => state.headerHeight);
  const { checkLoginStatus } = useAuthStore();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      // 전역 상태 업데이트,,
      checkLoginStatus().then(() => {
        alert("로그인에 성공했습니다.");
        router.push("/");
      });
    },
    onError: (error) => {
      alert(`로그인 실패: ${error.message}`);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <div
      className="font-paperlogy flex justify-center items-center h-screen"
      style={{ paddingTop: headerHeight }}
    >
      <div className="p-8 border rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex flex-col gap-2 dark:text-gray-300">
              <span>아이디</span>
              <input
                className="border border-neutral-400 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col gap-2 dark:text-gray-300">
              <span>비밀번호</span>
              <input
                className="border border-neutral-400 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="border-transparent bg-blue-600 px-6 py-2 rounded-lg text-lg text-neutral-50 hover:bg-blue-700 disabled:bg-gray-400"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
