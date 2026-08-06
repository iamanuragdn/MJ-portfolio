import asyncio

from backend import server


def test_startup_uses_default_projects_when_db_is_unavailable(monkeypatch):
    monkeypatch.setattr(server, "db", None)
    monkeypatch.setattr(server, "db_available", False)
    server.memory_projects = []
    server.memory_contacts = []

    async def run_startup():
        await server.startup()

    asyncio.run(run_startup())

    assert len(server.memory_projects) == len(server.DEFAULT_PROJECTS)
    assert server.memory_projects[0].id == "nocturne"
