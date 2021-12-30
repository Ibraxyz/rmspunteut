import { useState, useEffect } from "react";
import { db,app } from "../index";
import { collection, doc, addDoc, getDocs, deleteDoc, query, where, updateDoc } from "firebase/firestore";

const useDataOperations = (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [queryState, setQueryState] = useState(null);
  const addData = async (object) => {
    try {
      setIsLoading(true);
      const docRef = await addDoc(collectionRef, object);
      console.log("Document written with ID: ", docRef.id);
      setIsLoading(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      setIsLoading(false);
    }
  }
  const processData = async () => {
    if (queryState == null) {
      //do nothing
    } else {
      //alert(JSON.stringify(queryState))
      const dt = await getDocs(queryState);
      setIsLoading(false);
      setData(
        dt.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id
          }
        })
      )
    }
  }
  const getData = (filterLogic) => {
    setIsLoading(true);
    if (filterLogic === null || filterLogic.length === 0) {
      setQueryState(collectionRef);
    } else {
      const whereCollection = [];
      filterLogic.map((fl, i) => {
        whereCollection.push(where(fl.field, fl.operator, fl.value));
        if (i == filterLogic.length - 1) {
          const q = query(
            collectionRef, ...whereCollection
          );
          setQueryState(q);
        }
      })
    }
  }
  const editData = async (collectionName, id, newField) => {
    await updateDoc(doc(db, collectionName, id), newField);
  }
  const deleteData = async (collectionName, id) => {
    await deleteDoc(doc(db, collectionName, id));
  }
  useEffect(() => {
    console.log("query effect is called");
    processData();
  }, [queryState])
  return [isLoading, data, addData, getData, editData, deleteData];
}

export default useDataOperations;