"use client";

import {
  createActivity,
  deleteActivity,
  updateActivity,
} from "@/features/activity/lib/activities.client";
import { invalidateActivities } from "@/shared/config/client-fetch";
import { useMutationWithInvalidation } from "@/shared/hooks/useMutationWithInvalidation";

export function useCreateActivity() {
  return useMutationWithInvalidation(createActivity, invalidateActivities);
}

export function useUpdateActivity() {
  return useMutationWithInvalidation(updateActivity, invalidateActivities);
}

export function useDeleteActivity() {
  return useMutationWithInvalidation(deleteActivity, invalidateActivities);
}
