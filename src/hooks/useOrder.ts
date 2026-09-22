import { useEffect, useState } from "react";
import type { FetchState, Order } from "@/data/types";
import { mockOrders } from "@/data/mockOrders";

interface UseOrderOptions {
  delayMs?: number;

  forceError?: boolean;
}

export function useOrder(
  orderId: string,
  options: UseOrderOptions = {}
): FetchState<Order> & { refetch: () => void } {
  const { delayMs = 900, forceError = false } = options;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<FetchState<Order>>({ status: "loading" });
  const [resolvedForAttempt, setResolvedForAttempt] = useState(-1);

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (cancelled) return;

      if (forceError) {
        setResult({
          status: "error",
          message: "We couldn't load this order right now. Please try again.",
        });
        setResolvedForAttempt(attempt);
        return;
      }

      const order = mockOrders.find((o) => o.id === orderId);

      if (!order) {
        setResult({
          status: "error",
          message: `No order found with id "${orderId}".`,
        });
        setResolvedForAttempt(attempt);
        return;
      }

      setResult({ status: "success", data: order });
      setResolvedForAttempt(attempt);
    }, delayMs);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [orderId, delayMs, forceError, attempt]);

  const loading = resolvedForAttempt !== attempt;
  const state: FetchState<Order> = loading ? { status: "loading" } : result;
  const refetch = () => setAttempt((n) => n + 1);

  return { ...state, refetch };
}