"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { emailTemplates } from "@/lib/email"

export function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("welcome")
  const [previewData, setPreviewData] = useState({
    userName: "John Doe",
    novelTitle: "The Midnight Chronicles",
    chapterTitle: "The Awakening",
    chapterNumber: "1",
    novelId: "1",
    milestone: "50% Complete",
    newUserName: "Jane Smith",
    newUserEmail: "jane@example.com",
    authorName: "Sarah Chen",
  })

  const getTemplate = () => {
    switch (selectedTemplate) {
      case "welcome":
        return emailTemplates.welcome(previewData.userName)
      case "newChapter":
        return emailTemplates.newChapter(
          previewData.userName,
          previewData.novelTitle,
          previewData.chapterTitle,
          Number.parseInt(previewData.chapterNumber),
          previewData.novelId,
        )
      case "novelCompleted":
        return emailTemplates.novelCompleted(previewData.userName, previewData.novelTitle, previewData.novelId)
      case "readingMilestone":
        return emailTemplates.readingMilestone(previewData.userName, previewData.milestone, previewData.novelTitle)
      case "adminNewUser":
        return emailTemplates.adminNewUser("Admin", previewData.newUserName, previewData.newUserEmail)
      case "adminNewNovel":
        return emailTemplates.adminNewNovel("Admin", previewData.novelTitle, previewData.authorName)
      default:
        return emailTemplates.welcome(previewData.userName)
    }
  }

  const template = getTemplate()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Template Preview</CardTitle>
          <CardDescription>Preview and test email templates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template">Template Type</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="newChapter">New Chapter</SelectItem>
                  <SelectItem value="novelCompleted">Novel Completed</SelectItem>
                  <SelectItem value="readingMilestone">Reading Milestone</SelectItem>
                  <SelectItem value="adminNewUser">Admin: New User</SelectItem>
                  <SelectItem value="adminNewNovel">Admin: New Novel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={previewData.userName}
                onChange={(e) => setPreviewData({ ...previewData, userName: e.target.value })}
              />
            </div>
          </div>

          {(selectedTemplate === "newChapter" ||
            selectedTemplate === "novelCompleted" ||
            selectedTemplate === "readingMilestone") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="novelTitle">Novel Title</Label>
                <Input
                  id="novelTitle"
                  value={previewData.novelTitle}
                  onChange={(e) => setPreviewData({ ...previewData, novelTitle: e.target.value })}
                />
              </div>
              {selectedTemplate === "newChapter" && (
                <div>
                  <Label htmlFor="chapterTitle">Chapter Title</Label>
                  <Input
                    id="chapterTitle"
                    value={previewData.chapterTitle}
                    onChange={(e) => setPreviewData({ ...previewData, chapterTitle: e.target.value })}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
          <CardDescription>Subject: {template.subject}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white" dangerouslySetInnerHTML={{ __html: template.html }} />
        </CardContent>
      </Card>
    </div>
  )
}
