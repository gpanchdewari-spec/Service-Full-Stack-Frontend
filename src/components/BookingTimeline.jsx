
import {
  CheckCircle2,
  Clock3,
  UserRound,
  Truck,
  Wrench,
  CircleCheck,
  XCircle,
} from "lucide-react";

const STEPS = [
  {
    key: "Pending",
    title: "Booking placed",
    description: "Your booking request has been received.",
    icon: Clock3,
  },
  {
    key: "Confirmed",
    title: "Booking confirmed",
    description: "Your appointment has been confirmed.",
    icon: CheckCircle2,
  },
  {
    key: "Assigned",
    title: "Professional assigned",
    description: "A service professional has been assigned.",
    icon: UserRound,
  },
  {
    key: "OnTheWay",
    title: "Professional on the way",
    description: "Your professional is heading to your location.",
    icon: Truck,
  },
  {
    key: "InProgress",
    title: "Service started",
    description: "Your service is currently in progress.",
    icon: Wrench,
  },
  {
    key: "Completed",
    title: "Service completed",
    description: "Your service has been completed.",
    icon: CircleCheck,
  },
];

const statusIndex = {
  Pending: 0,
  Confirmed: 1,
  Assigned: 2,
  OnTheWay: 3,
  InProgress: 4,
  Completed: 5,
};

export default function BookingTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
            <XCircle size={22} />
          </div>

          <div>
            <p className="font-bold text-red-700">Booking cancelled</p>
            <p className="mt-1 text-sm text-red-600">
              This appointment has been cancelled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = statusIndex[status] ?? 0;

  return (
    <div className="mt-7">
      <div className="relative">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          const completed = index < currentIndex;
          const current = index === currentIndex;

          return (
            <div
              key={step.key}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {index !== STEPS.length - 1 && (
                <div
                  className={`absolute left-[19px] top-10 h-[calc(100%-18px)] w-[2px] ${
                    index < currentIndex
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${
                  completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : current
                    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`font-semibold ${
                      current
                        ? "text-blue-700"
                        : completed
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {current && (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
                      CURRENT
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

