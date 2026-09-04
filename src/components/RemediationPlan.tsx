import React, { useState } from 'react';
import { RemediationWeek, RemediationTask } from '../types';
import { Calendar, CheckCircle2, Clock, UserCheck, Scale, Download, Printer, ArrowRight } from 'lucide-react';

interface RemediationPlanProps {
  plan: RemediationWeek[];
  lang: 'ar' | 'en';
  targetDomain: string;
  onDownloadPdf?: () => void;
}

export const RemediationPlan: React.FC<RemediationPlanProps> = ({
  plan,
  lang,
  targetDomain,
  onDownloadPdf
}) => {
  const isAr = lang === 'ar';
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [taskStatus, setTaskStatus] = useState<Record<string, boolean>>({});

  const toggleTask = (taskId: string) => {
    setTaskStatus((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Calculate overall progress
  const allTasks = plan.flatMap((w) => w.tasks);
  const completedCount = allTasks.filter((t) => taskStatus[t.id]).length;
  const progressPercent = Math.round((completedCount / (allTasks.length || 1)) * 100);

  const currentWeekData = plan.find((w) => w.weekNumber === activeWeek) || plan[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Progress */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Scale className="h-3.5 w-3.5" />
              <span>{isAr ? 'خارطة طريق تنفيذية متدرجة لـ 30 يوماً' : '30-Day Step-by-Step Remediation Plan'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'خطة المعالجة والتوفيق القانوني مع CNDP' : 'Automated 30-Day Remediation Plan'}
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {isAr
                ? `خطة تصحيحية مخصصة لنطاق (${targetDomain}) مقسمة إلى 4 مراحل أسبوعية لمعالجة الثغرات التقنية والقانونية تدريجياً وصولاً للامتثال التام.`
                : `Customized roadmap tailored to ${targetDomain}, structured into 4 sequential weekly sprints bridging Law 08/09 technical and legal gaps.`}
            </p>
          </div>

          {/* Progress Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{isAr ? 'نسبة الإنجاز:' : 'Progress:'}</span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono text-center">
              {completedCount} / {allTasks.length} {isAr ? 'مهام مكتملة' : 'tasks completed'}
            </p>
          </div>
        </div>

        {/* Print / Export buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isAr ? 'تحميل التقرير الرسمي والخطة PDF' : 'Download Formal PDF Report & Plan'}</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <Printer className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isAr ? 'طباعة خطة العمل' : 'Print Action Plan'}</span>
          </button>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {plan.map((week) => {
          const isSelected = activeWeek === week.weekNumber;
          const weekTasks = week.tasks;
          const weekDone = weekTasks.filter((t) => taskStatus[t.id]).length;
          return (
            <button
              key={week.weekNumber}
              onClick={() => setActiveWeek(week.weekNumber)}
              className={`rounded-xl p-4 text-right border transition text-xs space-y-2 ${
                isSelected
                  ? 'border-emerald-500/80 bg-emerald-950/20 text-white shadow-lg ring-1 ring-emerald-500/50'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400">
                  {isAr ? `الأسبوع ${week.weekNumber}` : `Week ${week.weekNumber}`}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {weekDone}/{weekTasks.length}
                </span>
              </div>
              <h4 className="font-bold text-slate-200 line-clamp-1">
                {isAr ? week.weekTitleAr : week.phase}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Week Task List */}
      {currentWeekData && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                {isAr ? currentWeekData.weekTitle : `Sprint Week ${currentWeekData.weekNumber}`}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {isAr ? currentWeekData.weekTitleAr : currentWeekData.phase}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentWeekData.description}
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
              {isAr ? 'المدة المقدرة: 7 أيام' : 'Estimated Time: 7 Days'}
            </div>
          </div>

          <div className="space-y-3">
            {currentWeekData.tasks.map((task) => {
              const isDone = !!taskStatus[task.id];
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition flex items-start gap-4 ${
                    isDone
                      ? 'border-emerald-900/40 bg-emerald-950/10 opacity-75'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}}
                      className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h5
                        className={`text-sm font-semibold ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h5>
                      <span className="text-[11px] font-mono text-emerald-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shrink-0">
                        {task.lawRef}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                        <span>{task.assignedTo}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>{task.duration}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300'
                            : task.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
