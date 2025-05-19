export interface UserData { // ✅ Capitalized Interface Name (Best Practice)
    id: number; // Primary Key, Auto Increment
    email: string; // Unique user identifier
    firstName: string;
    lastName: string;
    age: number; // Ensures valid age entry (>= 18)
    gender: 'Male' | 'Female' | 'Other'; // ✅ Capitalized 'Other' for consistency
  }
  