"use client";

import { CheckCircle, UserCheck, DollarSign, ArrowRight, Sparkles, Target, Clock, Award } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type TaskKey = "business" | "dub" | "service" | "review" | "background";

interface Task {
  id: number;
  text: string;
  key: TaskKey;
  completed: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href?: string;
  description?: string;
}

const initialTasks: Task[] = [
  { id: 1, text: "Business Profile", key: "business", completed: true, icon: UserCheck, href: "/home-services/dashboard/services/step-4", description: "Basic business information and contact details" },
  { id: 2, text: "Availability", key: "dub", completed: true, icon: Clock, href: "/home-services/dashboard/services/step-7", description: "Set your working hours and availability" },
  { id: 3, text: "Pricing & Budget", key: "service", completed: true, icon: DollarSign, href: "/home-services/dashboard/services/step-10", description: "Define your service rates and budget" },
  { id: 4, text: "Customer Reviews", key: "review", completed: false, icon: Award, href: "/home-services/dashboard/services/step-5", description: "Add testimonials from past clients" },
  { id: 5, text: "Background Check", key: "background", completed: false, icon: Target, href: "/home-services/dashboard/services/step-11", description: "Verify your credentials and trustworthiness" },
];


export default function SetupProgress() {
  const [tasks] = useState<Task[]>(initialTasks);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const completedCount = tasks.filter(t => t.completed).length;
      const newProgressPercent = completedCount / tasks.length;
      setIsAnimating(true);
      setProgressPercent(newProgressPercent);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 800);
    return () => clearTimeout(timer);
  }, [tasks]);

  const incompleteCount = tasks.filter((t) => !t.completed).length;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressPercent);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 text-gray-800 dark:text-gray-100 rounded-sm transition-colors">
      <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">

        {/* Left side */}
        <div className="flex-1 space-y-6 sm:space-y-8 w-full">
          <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Complete Your Professional Profile</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Finish these steps to optimize your profile and start receiving quality leads
            </p>
          </div>

          {/* Progress card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <svg className="w-12 h-12 sm:w-14 sm:h-14 transform -rotate-90" viewBox="0 0 48 48" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r={radius} stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-gray-700" />
                  <circle cx="24" cy="24" r={radius} stroke="#0077B6" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-700 ease-in-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">{Math.round(progressPercent * 100)}%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100 text-base sm:text-lg font-medium">
                  {incompleteCount === 0 ? "Profile Complete!" : `${incompleteCount} Task${incompleteCount !== 1 ? 's' : ''} Remaining`}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                  {incompleteCount === 0 ? "Your profile is now optimized for maximum visibility" : "Complete your setup to start receiving leads"}
                </p>
              </div>
            </div>
          </div>

          {/* Tasks list */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
              <span>Setup Checklist</span>
              <div className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
            </h3>
            <ul className="space-y-3">
              {tasks.map(({ id, text, completed, icon: Icon, href, description }) =>
                href && !completed ? (
                  // ✅ Incomplete tasks are clickable
                  <Link
                    key={id}
                    href={`${href}?id=${id}`}
                    className={`block rounded-lg transition-all duration-200 ${completed
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <li className="flex items-start justify-between p-3 sm:p-4">
                      {/* Left side (icon + text) */}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full ${completed
                              ? "bg-[#0077B6]"
                              : "bg-white dark:bg-gray-800 border border-[#0077B6]"
                            }`}
                        >
                          {completed ? (
                            <CheckCircle className="text-white" size={18} />
                          ) : (
                            <Icon className="text-[#0077B6]" size={18} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${completed
                                  ? "text-[#0077B6]"
                                  : "text-gray-900 dark:text-gray-100 hover:text-[#0077B6] transition-colors"
                                }`}
                            >
                              {text}
                            </span>
                            {isAnimating && completed && (
                              <Sparkles className="text-[#0077B6]" size={14} />
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                            {description}
                          </p>
                        </div>
                      </div>

                      {/* Right side arrow */}
                      {!completed && (
                        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0077B6] text-white group-hover:bg-[#023E8A] transition-colors opacity-90">
                          <ArrowRight size={12} />
                        </div>
                      )}
                    </li>
                  </Link>
                ) : (
                  // ✅ Completed tasks (or no href) — not clickable
                  <li
                    key={id}
                    className={`flex items-start justify-between p-3 sm:p-4 rounded-lg transition-all duration-200 ${completed
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full ${completed
                            ? "bg-[#0077B6]"
                            : "bg-white dark:bg-gray-800 border border-[#0077B6]"
                          }`}
                      >
                        {completed ? (
                          <CheckCircle className="text-white" size={18} />
                        ) : (
                          <Icon className="text-[#0077B6]" size={18} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${completed
                                ? "text-[#0077B6]"
                                : "text-gray-900 dark:text-gray-100"
                              }`}
                          >
                            {text}
                          </span>
                          {isAnimating && completed && (
                            <Sparkles className="text-[#0077B6]" size={14} />
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1">
                          {description}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>

          </div>
        </div>
        {/* Right side */}
        <div className="flex-1 flex justify-center items-start w-full mt-8 lg:mt-0">
          <div className="relative w-full max-w-sm sm:max-w-md">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#00B4D8] to-[#0077B6] rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 rounded-full flex items-center justify-center">
                      <Image src="/service_profile.jpg" className="rounded-full" alt="" height={100} width={100} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                    {progressPercent === 1 ? "Profile Complete!" : "Complete Your Profile"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-[13px]">
                    {progressPercent === 1 ? "Your profile is now 5x more likely to be contacted by potential clients" : "Complete your profile to become eligible for leads — incomplete profiles won't be displayed to clients."}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Profile Strength</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{Math.round(progressPercent * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#48CAE4] to-[#0077B6] transition-all duration-1000 ease-out" style={{ width: `${progressPercent * 100}%` }}></div>
                  </div>
                </div>

                {incompleteCount > 0 && (
                  <button className="w-full bg-[#0077B6] hover:bg-[#023E8A] text-white font-normal py-2 sm:py-2.5 text-sm rounded-sm transition-colors">
                    Complete Setup Now
                  </button>
                )}
              </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -z-10 top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-[#48CAE4] opacity-20 rounded-full blur-xl"></div>
            <div className="absolute -z-10 bottom-4 -left-4 w-24 h-24 sm:w-28 sm:h-28 bg-[#00B4D8] opacity-20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
