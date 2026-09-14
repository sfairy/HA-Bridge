from __future__ import annotations

from api.ha_proxy import (
    allowed_media_proxy_path,
    hls_path_granted,
    hls_path_prefix,
    media_proxy_entity_id,
    remember_hls_path_grant,
    viewer_grant_key,
)
from dependencies import ViewerPrincipal


def test_media_proxy_entity_id_parsing():
    assert media_proxy_entity_id('/api/camera_proxy/camera.front') == 'camera.front'
    assert media_proxy_entity_id('/api/camera_proxy_stream/camera.gate') == 'camera.gate'
    assert media_proxy_entity_id('/api/image_proxy/image.badge') == 'image.badge'
    assert media_proxy_entity_id('/api/media_player_proxy/media_player.living') == 'media_player.living'
    assert media_proxy_entity_id('/api/hls/token/master_playlist.m3u8') is None
    assert media_proxy_entity_id('/api/camera_proxy/../etc/passwd') is None
    assert media_proxy_entity_id('/api/camera_proxy/not-an-entity') is None


def test_allowed_media_proxy_path_rejects_traversal():
    assert allowed_media_proxy_path('/api/camera_proxy/camera.front')
    assert not allowed_media_proxy_path('/api/camera_proxy/../secret')
    assert not allowed_media_proxy_path('/api/not_allowed/camera.front')


def test_hls_path_grant_scoped_to_viewer():
    admin = ViewerPrincipal(user=type('User', (), {'id': 'admin-1'})())
    display = ViewerPrincipal(display=type('Display', (), {'id': 'display-1', 'project_id': 'p1'})())
    stream = '/api/hls/abc123token/master_playlist.m3u8'
    remember_hls_path_grant(display, stream)
    assert hls_path_granted(display, '/api/hls/abc123token/segment/0.ts')
    assert not hls_path_granted(
        ViewerPrincipal(display=type('Display', (), {'id': 'display-2', 'project_id': 'p1'})()),
        '/api/hls/abc123token/segment/0.ts',
    )
    assert viewer_grant_key(admin) == 'user:admin-1'
    assert hls_path_prefix(stream) == '/api/hls/abc123token/'
