from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Header, Request
from fastapi.responses import Response, StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from storage import init_storage, put_object, get_object, build_path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

DEFAULT_PROJECTS = [
    {"id": "nocturne", "title": "NOCTURNE", "client": "A24 x Independent", "category": "Short Film", "year": "2025", "role": "Editor · Colorist", "runtime": "07:42", "span": "md:col-span-8", "poster": "https://images.unsplash.com/photo-1664653666218-c02c5bf868c8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400", "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"},
    {"id": "pulse", "title": "PULSE", "client": "Odesza Live", "category": "Music Video", "year": "2025", "role": "Editor", "runtime": "03:58", "span": "md:col-span-4", "poster": "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?crop=entropy&cs=srgb&fm=jpg&q=85&w=1000", "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"},
    {"id": "atlas", "title": "ATLAS", "client": "Nike / Brand Film", "category": "Commercial", "year": "2024", "role": "Editor · Motion", "runtime": "01:30", "span": "md:col-span-4", "poster": "https://images.pexels.com/photos/8100060/pexels-photo-8100060.jpeg?auto=compress&cs=tinysrgb&w=1000", "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"},
    {"id": "vantage", "title": "VANTAGE", "client": "YouTube Original", "category": "Docu-Series", "year": "2024", "role": "Lead Editor", "runtime": "18:20", "span": "md:col-span-8", "poster": "https://images.unsplash.com/photo-1682506457467-2342b2d86870?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400", "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"},
    {"id": "ember", "title": "EMBER", "client": "Festival Circuit", "category": "Short Film", "year": "2023", "role": "Editor · Colorist", "runtime": "11:05", "span": "md:col-span-6", "poster": "https://images.pexels.com/photos/8102674/pexels-photo-8102674.jpeg?auto=compress&cs=tinysrgb&w=1200", "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"},
    {"id": "static", "title": "STATIC", "client": "Social Campaign", "category": "Reels / Shorts", "year": "2023", "role": "Editor", "runtime": "00:45", "span": "md:col-span-6", "poster": "https://images.unsplash.com/photo-1515175192010-cf3250992719?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200", "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"},
]


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    project_type: Optional[str] = None
    message: str


class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    project_type: Optional[str] = None
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ProjectCreate(BaseModel):
    title: str
    client: str
    category: str
    year: str
    role: str
    runtime: str
    span: str = "md:col-span-6"
    poster: str
    video: str


class Project(ProjectCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_deleted: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


def _build_html(c: ContactCreate) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #222;">
          <tr><td style="padding:28px 32px;border-bottom:2px solid #FF2A00;">
            <div style="color:#FF2A00;font-size:12px;letter-spacing:3px;text-transform:uppercase;">New Enquiry</div>
            <div style="color:#ffffff;font-size:26px;font-weight:bold;margin-top:6px;">Kade Mercer / Studio</div>
          </td></tr>
          <tr><td style="padding:28px 32px;color:#e5e5e5;font-size:15px;line-height:1.7;">
            <p style="margin:0 0 8px;"><strong style="color:#888;">Name:</strong> {c.name}</p>
            <p style="margin:0 0 8px;"><strong style="color:#888;">Email:</strong> {c.email}</p>
            <p style="margin:0 0 8px;"><strong style="color:#888;">Project:</strong> {c.project_type or 'Not specified'}</p>
            <p style="margin:16px 0 6px;color:#888;"><strong>Message</strong></p>
            <p style="margin:0;color:#ffffff;white-space:pre-wrap;">{c.message}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


# ---------- Contact ----------
@api_router.post("/contact", response_model=Contact)
async def create_contact(input: ContactCreate):
    contact = Contact(**input.model_dump())
    await db.contacts.insert_one(contact.model_dump())
    payload = {
        "to": [OWNER_EMAIL],
        "subject": f"New portfolio enquiry from {input.name}",
        "html": _build_html(input),
        "from_name": EMAIL_FROM_NAME,
        "contact_email": input.email,
    }
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY}, json=payload,
            )
        resp.raise_for_status()
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Message saved but email delivery failed")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send message")
    return contact


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


# ---------- Projects ----------
@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    docs = await db.projects.find({"is_deleted": False}, {"_id": 0}).sort("created_at", 1).to_list(200)
    return docs


@api_router.post("/projects", response_model=Project)
async def create_project(input: ProjectCreate):
    project = Project(**input.model_dump())
    await db.projects.insert_one(project.model_dump())
    return project


@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    result = await db.projects.update_one({"id": project_id}, {"$set": {"is_deleted": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted", "id": project_id}


# ---------- Media storage ----------
@api_router.post("/upload")
async def upload(file: UploadFile = File(...), kind: str = "media"):
    folder = "videos" if kind == "video" else "images"
    path, content_type = build_path(file.filename or "file.bin", folder)
    ct = file.content_type or content_type
    data = await file.read()
    result = put_object(path, data, ct)
    stored_path = result["path"]
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": stored_path,
        "original_filename": file.filename,
        "content_type": ct,
        "size": result.get("size"),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": stored_path, "url": f"/api/files/{stored_path}", "content_type": ct, "size": result.get("size")}


@api_router.get("/files/{path:path}")
async def serve_file(path: str, request: Request):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    ct = record.get("content_type") or content_type
    total = len(data)

    range_header = request.headers.get("range")
    if range_header and range_header.startswith("bytes="):
        try:
            start_s, end_s = range_header.replace("bytes=", "").split("-")
            start = int(start_s) if start_s else 0
            end = int(end_s) if end_s else total - 1
            end = min(end, total - 1)
            chunk = data[start:end + 1]
            headers = {
                "Content-Range": f"bytes {start}-{end}/{total}",
                "Accept-Ranges": "bytes",
                "Content-Length": str(len(chunk)),
                "Cache-Control": "public, max-age=31536000",
            }
            return Response(content=chunk, status_code=206, media_type=ct, headers=headers)
        except Exception:
            pass

    return Response(content=data, media_type=ct, headers={
        "Accept-Ranges": "bytes",
        "Content-Length": str(total),
        "Cache-Control": "public, max-age=31536000",
    })


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    count = await db.projects.count_documents({})
    if count == 0:
        seeds = [Project(**p).model_dump() for p in DEFAULT_PROJECTS]
        await db.projects.insert_many(seeds)
        logger.info(f"Seeded {len(seeds)} default projects")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
