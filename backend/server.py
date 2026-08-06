from fastapi import FastAPI, APIRouter, HTTPException
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]


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
          <tr><td style="padding:18px 32px;border-top:1px solid #222;color:#555;font-size:12px;">
            Sent from your portfolio contact form.
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


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
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
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


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
