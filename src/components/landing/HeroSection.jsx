"use client";

import { useState } from "react";

import hero from "../../assets/hero.jpg";
import logo from "../../assets/logo2.png";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src={logo} className="h-8 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Open main menu</span>
              <Link to="/" className="text-sm/6 font-semibold text-white">
                Sign in <span aria-hidden="true">&rarr;</span>
              </Link>
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link to="/" className="text-sm/6 font-semibold text-white">
              Sign in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate overflow-hidden pt-14">
        <img
          alt=""
          src={hero}
          className="absolute inset-0 -z-10 size-full object-cover"
        />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center space-y-5">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
                Automated <span className="text-green-600">Security</span>{" "}
                Management
              </h1>
              <p className="text-sm font-light text-pretty text-white sm:text-base sm:max-w-xl mx-auto">
                Transform your community’s security operations with our seamless
                digital solution. Empower homeowners and club owners to manage
                guest access, submit reports, and stay connected—right from
                their fingertips.
              </p>
              <div className="mt-10 flex sm:flex-row flex-col gap-y-4 items-center justify-center gap-x-6">
                <Link
                  to="/"
                  className="rounded-full bg-white px-8 py-[14px] text-sm font-semibold text-[#181D27] shadow-xs "
                >
                  Sign in Home Owner
                </Link>
                <Link
                  to="/"
                  className="rounded-full bg-white px-8 py-[14px] text-sm font-semibold text-[#181D27] shadow-xs "
                >
                  Sign in Club Member
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
