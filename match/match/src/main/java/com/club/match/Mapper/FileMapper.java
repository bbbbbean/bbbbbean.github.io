package com.club.match.Mapper;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FileMapper {
    // INSERT
    int uploadFile(AttachmentFileDTO attachmentFileDTO);

    // SELECT
    AttachmentFileDTO selectAt(Long postAttachmentId);

    List<AttachmentFileDTO> selectFilesByPostId(Long postId);

    List<AttachmentFileDTO> selectFileList(String userId);

    List<AttachmentFileDTO> selectTempFileByUserId(String userId);

    // UPDATE
    int updatePostAttachmentUrl(
            @Param("newAttachmentUrl") String newAttachmentUrl,
            @Param("postId") Long postId,
            @Param("oldAttachmentUrl") String oldAttachmentUrl);

    int updatePostId(Long postId, String attachmentUrl);

    // DELETE
    int deleteFile(Long postAttachmentId);

    int deleteTempFileList(String userId);



    String chatFileDownload(String fileName);
}