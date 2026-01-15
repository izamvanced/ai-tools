const q = query(
  collection(db, "posts"),
  where("status", "==", "published")
);
