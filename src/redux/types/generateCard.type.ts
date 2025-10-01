export interface GenerateCardRequest {
theme: string;
description: string;
age: number;
gender: string;
birthday_person_name: string;
venue: string;
date: string; // keep as string to match API
time: string;
contact_info: string;
}


export interface GeneratedImage {
url: string;
public_id: string;
}


export interface GenerateCardResponse {
invitation_text: string;
images: GeneratedImage[];
}