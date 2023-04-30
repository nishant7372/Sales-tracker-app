import { useState, useEffect, useRef } from "react";
import { projectFireStore } from "../firebase/config";
import { type } from "@testing-library/user-event/dist/type";

export const useCollection = (
  collection,
  _query,
  compare,
  timeQuery,
  option,
  order,
  groupBy
) => {
  const [document, setDocument] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const query = useRef(_query).current;

  useEffect(() => {
    let ref = projectFireStore.collection(collection);

    if (query) {
      ref = ref.where(...query);
    }

    if (timeQuery) {
      ref = ref.where("createdAt", compare, timeQuery);
    }

    if (option === "createdAt" && option) {
      ref = ref.orderBy(option, order);
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setIsPending(true);
        let results = [];

        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        if (option === "amount") {
          if (order === "desc") {
            results.sort((a, b) => b.amount - a.amount);
          } else {
            results.sort((a, b) => a.amount - b.amount);
          }
        }

        if (groupBy) {
          results = results.reduce((result, transaction) => {
            const name = transaction[groupBy];
            if (!result[name]) {
              result[name] = [];
            }
            result[name].push(transaction);
            return result;
          }, {});

          results = Object.keys(results)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((sortedResults, key) => {
              sortedResults[key] = results[key];
              return sortedResults;
            }, {});
        }

        setDocument(results);
        setIsPending(false);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("Could not fetch the data...");
      }
    );

    //unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query, order, option, timeQuery, groupBy]);

  return { document, isPending, error };
};
